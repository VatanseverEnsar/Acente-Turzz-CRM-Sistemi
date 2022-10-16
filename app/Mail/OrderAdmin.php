<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderAdmin extends Mailable
{
    use Queueable, SerializesModels;
    protected $data;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        $data = $this->data;
        return $this->from('postmaster@mg.jsonyazilim.com', __('frontend.site_title'))
                        ->subject('Yeni Sipariş Talebi')
                        ->view('emails.order_admin')
                        ->with([
                            'name' => $data['name'],
                            'email' => $data['email'],
                            'product_title' => $data['product_title'],
                            'product_title_ar' => $data['product_title_ar'],
                            'image' => $data['image'],
                            'site_name' => $data['site_name'],
                            'order_no' => $data['order_no'],
                            'quantity' => $data['quantity'],
                            'total_price' => $data['total_price'],
                            'shipping' => $data['shipping'],
                            'price' => $data['price'],
                            'order_date' => $data['order_date']
        ]);
    }
}
