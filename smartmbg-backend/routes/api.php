<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ReviewController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/change-password', [AuthController::class, 'changePassword']);
    
    // AI Integration Route
    Route::post('/analyze-food', [AIController::class, 'analyzeFood']);
    Route::get('/nutrition-histories', [AIController::class, 'getNutritionHistory']);

    // Review Routes
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});
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

// Mitra Routes
Route::get('/mitras', function () {
    return App\Models\User::where('role', 'mitra')->get();
});
