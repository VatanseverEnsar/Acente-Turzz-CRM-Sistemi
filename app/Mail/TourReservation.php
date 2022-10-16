<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class TourReservation extends Mailable
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
    public function build()
    {
        $data = $this->data;
        return $this->from('postmaster@mg.jsonyazilim.com')
                        ->subject(__('frontend.tour_mail_subject'))
                        ->view('emails.tour_reservation')
                        ->with([
                            'name' => $data['name'],
                            'email' => $data['email'],
                            'tour' => $data['tour'],
                            'count' => $data['count'],
                            'person_data' => $data['person_data'],
                            'note' => $data['note'],
                            'order_id' => $data['order_id']
                        ]);
    }
}
