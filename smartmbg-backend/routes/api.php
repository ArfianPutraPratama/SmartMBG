<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\GoogleAuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/google', [GoogleAuthController::class, 'verifyGoogleLogin']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/laporan-mitra', [App\Http\Controllers\LaporanMitraController::class, 'index']);
Route::post('/laporan-mitra', [App\Http\Controllers\LaporanMitraController::class, 'store']);
Route::get('/laporan-mitra/{id}', [App\Http\Controllers\LaporanMitraController::class, 'show']);
Route::put('/laporan-mitra/{id}', [App\Http\Controllers\LaporanMitraController::class, 'update']);
Route::delete('/laporan-mitra/{id}', [App\Http\Controllers\LaporanMitraController::class, 'destroy']);

Route::get('/gudang-mitra', [App\Http\Controllers\GudangMitraController::class, 'index']);
Route::post('/gudang-mitra/reset', [App\Http\Controllers\GudangMitraController::class, 'reset']);
Route::post('/gudang-mitra/capacity', [App\Http\Controllers\GudangMitraController::class, 'updateCapacity']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/change-password', [AuthController::class, 'changePassword']);
    
    // Review Routes
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});

// AI Integration Route
Route::post('/analyze-food', [AIController::class, 'analyzeFood']);
Route::get('/nutrition-histories', [AIController::class, 'getNutritionHistory']);
// SPPG Food Waste Routes
use App\Http\Controllers\SppgFoodWasteController;
Route::get('/sppg/food-wastes', [SppgFoodWasteController::class, 'index']);
Route::post('/sppg/food-wastes', [SppgFoodWasteController::class, 'store']);
Route::put('/sppg/food-wastes/{id}/take', [SppgFoodWasteController::class, 'takeFoodWaste']);
Route::put('/sppg/food-wastes/{id}/complete', [SppgFoodWasteController::class, 'completeFoodWaste']);

use App\Http\Controllers\EntitasController;

// Entitas Routes
Route::get('/entitas', [EntitasController::class, 'index']);
Route::post('/entitas', [EntitasController::class, 'store']);
Route::put('/entitas/{id}', [EntitasController::class, 'update']);
Route::delete('/entitas/{id}', [EntitasController::class, 'destroy']);

// Mitra Routes
Route::get('/mitras', function () {
    return App\Models\User::where('role', 'mitra')->get();
});

// School Routes
Route::get('/schools', function () {
    return App\Models\User::where('role', 'guru')->get();
});
