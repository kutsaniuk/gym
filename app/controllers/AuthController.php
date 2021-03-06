<?php

/**
 * Created by PhpStorm.
 * User: root
 * Date: 18.05.16
 * Time: 14:03
 */

use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Mvc\Router;

/**
 * @RoutePrefix("/auth")
 */
class AuthController extends Controller
{
    /**
     * @Post("/login")
     */
    public function loginAction()
    {
        $_user = $this->request->getJsonRawBody();

        $user = Users::findFirst(
            array(
                "username = :username: AND password = :password: AND active = true",
                'bind' => array(
                    'username' => $_user->username,
                    'password' => sha1($_user->password)
                )
            )
        );

        $this->session->set('id', $user->id);

        $response = new Response();

        if ($user) {
            $response->setStatusCode(200);
            $response->setJsonContent(
                array(
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role
                )
            );
        }
        else {
            return $response->setStatusCode(401);
        }

        return $response;
    }

    /**
     * @Post("/register")
     */
    public function registerAction()
    {
        $user = new Users();

        $_user = $this->request->getJsonRawBody();
        
        $user->assign(array(
            'username' => $_user->username,
            'password' => sha1($_user->password),
            'email' => $_user->email,
            'created' => $_user->created,
            'language' => $_user->language,
            'role' => $_user->role,
            'active' => true
        ));

        $response = new Response();

        if ($user->save())
            return $response->setStatusCode(200);
        else
            return $response->setStatusCode(409);
    }

    /**
     * @Get("check")
     */
    public function checkAction(){
        $username = (string)$_GET["username"];

        $query = "SELECT * FROM User WHERE User.username = '$username'";
        $users = $this->modelsManager->createQuery($query)->execute();

        $_users = array();

        foreach ($users as $user)
            $_users[] = $user;

        $response = new Response();

        if ($_users != null) {
            $response->setStatusCode(409);
        }
        else $response->setStatusCode(200);



        return $response;
    }
}