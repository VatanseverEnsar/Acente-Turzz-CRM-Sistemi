<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketMail extends Mailable {

    use Queueable,
        SerializesModels;

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
        return $this->from('postmaster@mg.ucuzucuyorum.com', 'Ekonomik Uçak Bileti, Ucuzucuyorum.com')
                        ->subject(__($data['booking_code'].' PNR No\'lu uçuşunuz oluşturulmuştur.'))
                        ->view('emails.reservation')
                        ->with([
                            'ticket_number' => $data['ticket_number'],
                            'booking_code' => $data['booking_code'],
                            'ticket_name' => $data['ticket_name'],
                            'segments' => unserialize($data['segments_data']),
                            'passengers' => unserialize($data['passenger_data'])
        ]);
    }

}
