<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class contactMessage extends Notification {

    use Queueable;

    protected $data;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data) {
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        return (new MailMessage)
                        ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
                        ->subject('Yeni İletşim Talebi')
                        ->line('Merhaba ' . $notifiable->name . ',')
                        ->line('Sisteme bir bayi tarafından yeni bir iletişim talebi iletilmiştir. Talep detayları aşağıda ki gibidir;')
                        ->line(new HtmlString('<strong>İsim Soyisim: </strong> '.$this->data['name']))
                        ->line(new HtmlString('<strong>Konu: </strong> '.$this->data['subject']))
                        ->line(new HtmlString('<strong>Telefon: </strong> '.$this->data['phone']))
                        ->line(new HtmlString('<strong>Mesaj: </strong> '))
                        ->line($this->data['message']);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable) {
        return [
                //
        ];
    }

}
