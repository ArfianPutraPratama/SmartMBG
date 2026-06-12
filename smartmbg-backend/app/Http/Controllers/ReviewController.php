<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Review;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user:id,name,avatar,role')->latest()->get();
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'date' => 'required|date',
            'school_name' => 'required|string|max:255',
            'is_match' => 'required|in:cocok,tidak_cocok',
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,webp,jfif|max:5120'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            if (!$file->isValid()) {
                \Log::error('Upload error: ' . $file->getErrorMessage());
                return response()->json(['message' => 'File gambar terlalu besar atau korup. Maksimal 2MB sesuai batasan server.'], 422);
            }
            $imagePath = $file->store('reviews', 'public');
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'image' => $imagePath,
            'rating' => $request->rating,
            'date' => $request->date,
            'school_name' => $request->school_name,
            'is_match' => $request->is_match === 'cocok',
            'description' => $request->description,
        ]);

        $review->load('user:id,name,avatar,role');

        return response()->json([
            'message' => 'Ulasan berhasil disimpan.',
            'review' => $review
        ], 201);
    }
}
