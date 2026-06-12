<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function analyzeFood(Request $request)
    {
        $request->validate([
            'image' => 'required|file|max:2048',
        ]);

        try {
            $image = $request->file('image');
            $imagePath = $image->getPathname();
            $imageName = $image->getClientOriginalName();

            // Forward the image to the Python FastAPI microservice
            $response = Http::timeout(60)->attach(
                'file', file_get_contents($imagePath), $imageName
            )->post('http://127.0.0.1:8001/analyze-food');

            if ($response->successful()) {
                $responseData = $response->json();
                
                if (isset($responseData['status']) && $responseData['status'] === 'success') {
                    $gizi = $responseData['gizi'] ?? [];
                    \App\Models\NutritionHistory::create([
                        'user_id' => null,
                        'menu_terdeteksi' => $responseData['menu_terdeteksi'] ?? [],
                        'porsi' => 'Besar',
                        'kalori' => $gizi['kalori'] ?? 0,
                        'protein' => $gizi['protein'] ?? 0,
                        'lemak' => $gizi['lemak'] ?? 0,
                        'karbo' => $gizi['karbo'] ?? 0,
                        'serat' => $gizi['serat'] ?? 0,
                        'vitamin_mineral' => $gizi['vitamin_mineral'] ?? ($gizi['vit'] ?? 0),
                    ]);
                }

                return response()->json($responseData, 200);
            } else {
                Log::error('AI Server Error: ' . $response->body());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal menganalisis gambar di server AI.'
                ], $response->status());
            }

        } catch (\Exception $e) {
            Log::error('AI Integration Exception: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghubungkan ke Server AI. Pastikan server Python berjalan di port 8001.'
            ], 500);
        }
    }

    public function getNutritionHistory()
    {
        $histories = \App\Models\NutritionHistory::orderByDesc('created_at')->limit(50)->get();
        return response()->json([
            'status' => 'success',
            'data' => $histories
        ]);
    }
}
