<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Entitas;

class EntitasController extends Controller
{
    public function index()
    {
        $entitas = Entitas::orderBy('created_at', 'desc')->get();
        return response()->json($entitas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'tipe' => 'nullable|string',
            'status_mbg' => 'required|string',
            'alamat' => 'required|string',
            'catatan' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $entitas = Entitas::create([
            'nama' => $validated['nama'],
            'tipe' => $validated['tipe'] ?? 'Sekolah',
            'status_mbg' => $validated['status_mbg'],
            'alamat' => $validated['alamat'],
            'catatan' => $validated['catatan'] ?? null,
            'lat' => $validated['lat'] ?? null,
            'lng' => $validated['lng'] ?? null,
        ]);

        return response()->json($entitas, 201);
    }

    public function destroy($id)
    {
        $entitas = Entitas::find($id);
        if (!$entitas) {
            return response()->json(['message' => 'Entitas not found'], 404);
        }
        $entitas->delete();
        return response()->json(['message' => 'Entitas deleted successfully']);
    }
}
