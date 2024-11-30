<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketplaceOrderBid extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'user_id', 'bid_amount', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function marketplaceOrder()
    {
        return $this->belongsTo(MarketplaceOrder::class);
    }
}
