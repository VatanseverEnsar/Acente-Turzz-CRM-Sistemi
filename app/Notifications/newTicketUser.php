<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class newTicketUser extends Notification {

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
                        ->subject('[Ticket ID: '.$this->data['ticket_id'].'] '.$this->data['subject'].'. Yeni destek talebi')
                        ->line('Merhaba ' . $notifiable->name . ',')
                        ->line('Bizimle iletişim kurduğunuz için teşekkür ederiz. Bu, destek bildiriminizin alındığını gösteren otomatik bir cevaptır. Destek ekibimiz en kısa sürede size dönüş yapacaktır. Destek bildiriminizin detayları aşağıdaki gibidir.')
                        ->line(new HtmlString('<h3>Bildirim Detayları</h3>'))
                        ->line(new HtmlString('<strong>Destek ID: </strong> '.$this->data['ticket_id'].'<br><strong>Başlık: </strong>'.$this->data['title'].'<br><strong>Konu: </strong>'.$this->data['subject']))
                        ->line('Destek talebinizin süreci ile ilgili sizi bilgilendiriyor olacağız')
                        ->action('Destek Taleplerim', Route('admin.ticket.index'));
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
