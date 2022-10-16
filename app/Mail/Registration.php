<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Registration extends Mailable {

    use Queueable, SerializesModels;
    
    protected $data;
    
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data) {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        $data = $this->data;
        return $this->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
                        ->subject("Sisteme yeni bir kullanıcı kayıt oldu.")
                        ->view('emails.register')
                        ->with([
                            'name' => $data['name'],
                            'email' => $data['email'],
                            'user_id' => $data['user_id'],
                            'site_name' => 'Marka Temsilci'
                        ]);
    }

}
