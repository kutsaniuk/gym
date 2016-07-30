<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Validator\Email as EmailValidator;
use Phalcon\Mvc\Model\Validator\Uniqueness as UniquenessValidator;

class Posts extends Model
{
    public $id;
    
    public $title;

    public $text;

    public $created;

    public $users_id;
}
