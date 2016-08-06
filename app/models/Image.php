<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Validator\Email as EmailValidator;
use Phalcon\Mvc\Model\Validator\Uniqueness as UniquenessValidator;

class Image extends Model
{
    public $id;
    
    public $base64;

    public $filename;

    public $filesize;

    public $filetype;
}
