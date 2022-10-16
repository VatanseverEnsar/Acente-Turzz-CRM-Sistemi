<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class closeTicketAdmin extends Notification {

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
                        ->subject('#'.$this->data['ticket_id'].'. No\'lu destek talebi kapatılmıştır.')
                        ->line('Merhaba ' . $notifiable->name . ',')
                        ->line('#'.$this->data['ticket_id'].'. No\'lu destek talebi çözümlendiği için kapatılmıştır. Destek talebini incelemek için aşağıda ki bağlantıya tıklayınız.')
                        ->line(new HtmlString('<strong>Destek ID: </strong> '.$this->data['ticket_id'].'<br><strong>Başlık: </strong>'.$this->data['title'].'<br><strong>Konu: </strong>'.$this->data['subject']))
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
