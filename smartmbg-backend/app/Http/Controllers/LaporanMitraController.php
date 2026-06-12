<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LaporanMitraController extends Controller
{
    public function index()
    {
        $laporan = \App\Models\LaporanMitra::orderBy('tanggal_operasional', 'desc')->get();
        return response()->json($laporan);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'batch_id' => 'required|string',
            'tanggal_operasional' => 'required|date',
            'hasil_olahan' => 'required|string',
            'volume' => 'required|numeric',
            'harga' => 'required|numeric',
            'catatan' => 'nullable|string',
            'status' => 'required|string|in:diproses,selesai,dibatalkan'
        ]);

        $laporan = \App\Models\LaporanMitra::create($validated);

        // Update Gudang
        $gudang = \App\Models\GudangMitra::first();
        if ($gudang) {
            $gudang->terisi += ($validated['volume'] / 1000); // Convert Kg to Ton
            $gudang->save();
        }

        return response()->json([
            'message' => 'Laporan berhasil disimpan!',
            'data' => $laporan
        ], 201);
    }

    public function show($id)
    {
        $laporan = \App\Models\LaporanMitra::findOrFail($id);
        return response()->json($laporan);
    }

    public function update(Request $request, $id)
    {
        $laporan = \App\Models\LaporanMitra::findOrFail($id);

        $validated = $request->validate([
            'batch_id' => 'required|string',
            'tanggal_operasional' => 'required|date',
            'hasil_olahan' => 'required|string',
            'volume' => 'required|numeric',
            'harga' => 'required|numeric',
            'catatan' => 'nullable|string',
            'status' => 'required|string|in:diproses,selesai,dibatalkan'
        ]);

        $oldVolume = $laporan->volume;
        $newVolume = $validated['volume'];

        $laporan->update($validated);

        // Update Gudang
        if ($oldVolume != $newVolume) {
            $gudang = \App\Models\GudangMitra::first();
            if ($gudang) {
                $difference = ($newVolume - $oldVolume) / 1000; // Convert Kg to Ton
                $gudang->terisi += $difference;
                if ($gudang->terisi < 0) $gudang->terisi = 0;
                $gudang->save();
            }
        }

        return response()->json([
            'message' => 'Laporan berhasil diperbarui!',
            'data' => $laporan
        ]);
    }

    public function destroy($id)
    {
        $laporan = \App\Models\LaporanMitra::findOrFail($id);

        // Deduct volume from Gudang
        $gudang = \App\Models\GudangMitra::first();
        if ($gudang) {
            $gudang->terisi -= ($laporan->volume / 1000); // Convert Kg to Ton
            if ($gudang->terisi < 0) {
                $gudang->terisi = 0;
            }
            $gudang->save();
        }

        $laporan->delete();

        return response()->json([
            'message' => 'Laporan berhasil dihapus!'
        ]);
    }
}
