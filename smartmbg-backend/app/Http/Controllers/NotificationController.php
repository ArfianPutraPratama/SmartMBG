<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();

        $formatted = $notifications->map(function ($notif) {
            return [
                'id' => $notif->id,
                'title' => $notif->title,
                'message' => $notif->message,
                'time' => $notif->created_at->diffForHumans(),
                'isRead' => (bool)$notif->is_read,
                'type' => $notif->type,
            ];
        });

        return response()->json($formatted);
    }

    public function markAsRead(Request $request)
    {
        $user = Auth::user();
        $user->notifications()->where('is_read', false)->update(['is_read' => true]);

        return response()->json(['status' => 'success', 'message' => 'All notifications marked as read']);
    }
}
