<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Google_Client;

class GoogleAuthController extends Controller
{
    public function verifyGoogleLogin(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        $accessToken = $request->access_token;
        
        // Fetch user profile from Google using the access token
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->request('GET', 'https://www.googleapis.com/oauth2/v3/userinfo', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]);
            $payload = json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Google token',
            ], 401);
        }

        if ($payload && isset($payload['email'])) {
            $googleId = $payload['sub'];
            $email = $payload['email'];
            $name = $payload['name'];

            // Cek apakah user sudah ada berdasarkan email atau google_id
            $user = User::where('email', $email)->orWhere('google_id', $googleId)->first();

            if ($user) {
                // Update google_id jika belum ada
                if (!$user->google_id) {
                    $user->google_id = $googleId;
                    $user->save();
                }

                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'message' => 'Login berhasil',
                    'user' => $user,
                    'token' => $token,
                ]);
            } else {
                // User belum terdaftar di sistem kita, beritahu frontend untuk redirect ke registrasi
                return response()->json([
                    'status' => 'not_registered',
                    'message' => 'Email belum terdaftar',
                    'google_data' => [
                        'email' => $email,
                        'name' => $name,
                        'google_id' => $googleId
                    ]
                ], 404);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user info',
            ], 401);
        }
    }
}
