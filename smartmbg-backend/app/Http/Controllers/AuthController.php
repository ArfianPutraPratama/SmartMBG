<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\OtpMail;
use App\Mail\ResetPasswordOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'role' => 'required|in:guru,sppg,mitra',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8',
            'google_id' => 'nullable|string'
        ]);

        $otp = sprintf("%06d", mt_rand(1, 999999));

        $user = User::create([
            'role' => $request->role,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'google_id' => $request->google_id,
            'otp' => Hash::make($otp),
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        // Jika user daftar pakai Google, anggap email sudah terverifikasi otomatis
        if ($request->has('google_id') && !empty($request->google_id)) {
            $user->email_verified_at = now();
            $user->otp = null;
            $user->otp_expires_at = null;
            $user->save();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registrasi berhasil.',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'is_google' => true
            ], 201);
        }

        // Kirim email OTP
        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan cek email Anda untuk kode OTP.',
            'user' => $user,
            'is_google' => false
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Pengguna tidak ditemukan.'],
            ]);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email sudah diverifikasi sebelumnya.']);
        }

        if (!$user->otp_expires_at || now()->greaterThan($user->otp_expires_at)) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP sudah kadaluarsa.'],
            ]);
        }

        if (!Hash::check($request->otp, $user->otp)) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP tidak valid.'],
            ]);
        }

        $user->update([
            'email_verified_at' => now(),
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Verifikasi berhasil.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Pengguna tidak ditemukan.'],
            ]);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email sudah diverifikasi sebelumnya.']);
        }

        $otp = sprintf("%06d", mt_rand(1, 999999));

        $user->update([
            'otp' => Hash::make($otp),
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        // Kirim email OTP
        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json([
            'message' => 'Kode OTP baru telah dikirimkan ke email Anda.',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Alamat email atau kata sandi salah.'],
            ]);
        }

        if (! $user->email_verified_at) {
            throw ValidationException::withMessages([
                'email' => ['Alamat email belum diverifikasi. Silakan cek email Anda atau kirim ulang kode OTP.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        \Log::info('Update Profile Request Data:', $request->all());
        \Log::info('Update Profile Request Files:', $request->allFiles());

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $updateData = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ];

        if ($request->hasFile('avatar')) {
            if ($user->avatar && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->avatar)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $path;
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak terdaftar.'
            ], 404);
        }

        // Generate OTP baru
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $user->otp = Hash::make($otp);
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        try {
            Mail::to($user->email)->send(new \App\Mail\ResetPasswordOtpMail($otp));
            return response()->json(['message' => 'Kode OTP untuk reset kata sandi telah dikirim ke email Anda.'], 200);
        } catch (\Exception $e) {
            \Log::error('Mail sending failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal mengirim email OTP. Silakan coba lagi nanti.'
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email tidak terdaftar.'], 404);
        }

        if (!Hash::check($request->otp, $user->otp)) {
            return response()->json(['message' => 'Kode OTP tidak valid.'], 400);
        }

        if (now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['message' => 'Kode OTP telah kedaluwarsa.'], 400);
        }

        // Reset password
        $user->password = Hash::make($request->password);
        $user->otp = null;
        $user->otp_expires_at = null;
        
        // Tandai email sebagai terverifikasi jika belum, karena pengguna telah memvalidasi OTP via email
        if (is_null($user->email_verified_at)) {
            $user->email_verified_at = now();
        }
        
        $user->save();

        return response()->json(['message' => 'Kata sandi berhasil diatur ulang. Silakan masuk menggunakan kata sandi baru Anda.'], 200);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|different:current_password',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Kata sandi saat ini tidak cocok.'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Kata sandi berhasil diubah.'], 200);
    }
}
