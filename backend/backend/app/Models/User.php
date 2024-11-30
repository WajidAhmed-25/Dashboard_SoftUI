<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable 
{
    use  HasApiTokens, Notifiable;
    protected $fillable = ['name', 'last_name', 'email', 'password', 'phone_number', 'role', 'profile_picture', 'is_active', 'category_id'];

    public function category()
    {
        return $this->belongsTo(UserCategory::class);
    }

    public function emailResponses()
    {
        return $this->hasMany(EmailResponse::class, 'assign_order_to_designer');
    }

    public function assignedOrders()
    {
        return $this->hasMany(AssignOrder::class);
    }

    public function orderLogs()
    {
        return $this->hasMany(OrderLog::class);
    }

    public function orderInvoices()
    {
        return $this->hasMany(OrderInvoice::class);
    }

    public function marketplaceOrders()
    {
        return $this->hasMany(MarketplaceOrder::class);
    }

    public function marketplaceOrderBids()
    {
        return $this->hasMany(MarketplaceOrderBid::class);
    }

    public function marketplaceOrderAssigns()
    {
        return $this->hasMany(MarketplaceOrderAssign::class);
    }
}
