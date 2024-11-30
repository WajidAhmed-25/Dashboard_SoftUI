<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderLog extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'user_id', 'status', 'description', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function emailResponse()
    // {
    //     return $this->belongsTo(EmailResponse::class);
    // }

    public function emailResponse()
    {
        return $this->belongsTo(EmailResponse::class, 'order_id', 'id');
    }
}
