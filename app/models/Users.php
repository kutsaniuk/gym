<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Validator\Email as EmailValidator;
use Phalcon\Mvc\Model\Validator\Uniqueness as UniquenessValidator;

class Users extends Model
{
    public $id;

    public $email;

    public $username;

    public $password;

    public $active;

    public $created;

    public $lang;

    public $role;
}
