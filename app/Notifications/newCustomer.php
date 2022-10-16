<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class newCustomer extends Notification {

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
                        ->subject('Sisteme yeni bir müşteri talebi gönderildi.')
                        ->line('Merhaba ' . $notifiable->name . ',')
                        ->line('Sisteme '. $this->data['first_name'] .' '. $this->data['last_name'] .' tarafından yeni bir müşteri talebi iletildi. Detayları incelemek için lütfen aşağıda ki bağlantıya tıklayınız.')
                        ->action('Müşteri Listesi', Route('admin.customer.index'));
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
