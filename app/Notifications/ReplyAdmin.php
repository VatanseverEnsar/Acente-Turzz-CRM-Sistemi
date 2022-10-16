<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class ReplyAdmin extends Notification {

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
                        ->subject('#'.$this->data['ticket_id'].'. No\'lu destek talebine bir yanıt gönderildi.')
                        ->line('Merhaba ' . $notifiable->name . ',')
                        ->line('Sisteme daha önce gönderilmiş olan destek talebi için bir yanıt gönderildi. Destek talebini incelemek için aşağıda ki bağlantıya tıklayınız.')
                        ->action('Destek Talebi', Route('admin.ticket.edit', ['id'=>$this->data['ticket_id']]));
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
