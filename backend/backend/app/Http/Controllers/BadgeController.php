<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Badge;
class BadgeController extends Controller
{
    //
    public function index()
    {
        $badges = Badge::all();
        return response()->json($badges);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);
        $badge = Badge::create($validated);
        return response()->json($badge, 201);
    }

    public function show($id)
    {
        $badge = Badge::findOrFail($id);
        return response()->json($badge);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);
        
        $badge = Badge::findOrFail($id);
        $badge->update($validated);
        return response()->json($badge);
    }

    public function destroy($id)
    {
        Badge::destroy($id);
        return response()->json(null, 204);
    }
}
