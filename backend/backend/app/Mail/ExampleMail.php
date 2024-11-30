<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ExampleMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;
    public $subject;
    public $attachmentPath;

    /**
     * Create a new message instance.
     *
     * @param array $details
     * @param string $subject
     * @param string $attachmentPath
     */
    public function __construct($details, $subject, $attachmentPath = null)
    {
        $this->details = $details;
        $this->subject = $subject;
        $this->attachmentPath = $attachmentPath;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $email = $this->subject($this->subject)
                      ->view('emails.example');
        
        // Attach the file if the path is provided
        if ($this->attachmentPath) {
            $email->attach($this->attachmentPath);
        }

        return $email;
    }
}
