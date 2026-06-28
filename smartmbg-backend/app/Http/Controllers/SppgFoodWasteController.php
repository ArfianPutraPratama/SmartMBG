<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SppgFoodWaste;
use Illuminate\Support\Facades\Storage;

class SppgFoodWasteController extends Controller
{
    public function index(Request $request)
    {
        $query = SppgFoodWaste::orderBy('created_at', 'desc');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $foodWastes = $query->get();
        return response()->json($foodWastes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'jenis_makanan' => 'required|string',
            'berat' => 'required|numeric|max:999999',
            'waktu_input' => 'nullable|string',
            'lokasi' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'keterangan' => 'nullable|string',
            'sppg_username' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $validatedData['status'] = 'Belum Diambil';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('food_wastes', 'public');
            $validatedData['image_path'] = 'storage/' . $path;
        }

        $foodWaste = SppgFoodWaste::create($validatedData);

        return response()->json([
            'message' => 'Data berhasil disimpan',
            'data' => $foodWaste
        ], 201);
    }

    public function takeFoodWaste(Request $request, $id)
    {
        $foodWaste = SppgFoodWaste::findOrFail($id);
        
        $foodWaste->update([
            'status' => 'Diambil',
            'mitra_id' => 1 // Hardcoded for demo
        ]);

        return response()->json([
            'message' => 'Status berhasil diubah menjadi Diambil',
            'data' => $foodWaste
        ]);
    }

    public function completeFoodWaste(Request $request, $id)
    {
        $foodWaste = SppgFoodWaste::findOrFail($id);
        
        $foodWaste->update([
            'status' => 'Selesai'
        ]);

        return response()->json([
            'message' => 'Status berhasil diubah menjadi Selesai',
            'data' => $foodWaste
        ]);
    }
}
