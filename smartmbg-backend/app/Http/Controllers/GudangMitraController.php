<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GudangMitraController extends Controller
{
    public function index()
    {
        $gudang = \App\Models\GudangMitra::first();
        if (!$gudang) {
            $gudang = \App\Models\GudangMitra::create(['terisi' => 0, 'kapasitas_maksimal' => 10]);
        }
        return response()->json($gudang);
    }

    public function reset()
    {
        $gudang = \App\Models\GudangMitra::first();
        if ($gudang) {
            $gudang->terisi = 0;
            $gudang->save();
        }
        return response()->json(['message' => 'Kapasitas gudang berhasil di-reset', 'data' => $gudang]);
    }

    public function updateCapacity(Request $request)
    {
        $request->validate([
            'kapasitas_maksimal' => 'required|numeric|min:1'
        ]);

        $gudang = \App\Models\GudangMitra::first();
        if ($gudang) {
            $gudang->kapasitas_maksimal = $request->kapasitas_maksimal;
            $gudang->save();
        }
        return response()->json(['message' => 'Kapasitas maksimal berhasil diperbarui', 'data' => $gudang]);
    }
}
