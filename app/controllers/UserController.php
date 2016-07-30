<?php

/**
 * Created by PhpStorm.
 * User: root
 * Date: 29.07.16
 * Time: 15:53
 */

use Phalcon\Mvc\Controller;
use Phalcon\Mvc\Model\Query;
use Phalcon\Http\Response as response;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

/**
 * @RoutePrefix("/user")
 */
class UserController extends Controller
{
    /**
     * @Get("/")
     */
    public function indexAction()
    {
        $currentPage = (int)$_GET["page"];
        $limit = (int)$_GET["limit"];

        $users = Users::find();
        $paginator = new PaginatorModel(
            array(
                "data" => $users,
                "limit" => $limit,
                "page" => $currentPage
            )
        );

        $page = $paginator->getPaginate();

        $response = new Response();
        $response->setContentType("application/json");

        if (!$users) $response->setStatusCode(404);
        else $response->setJsonContent($page);

        return $response;
    }

    /**
     * @Get("/profile/{id:[0-9]+}")
     */
    public function profileAction($id)
    {
        $user = Users::findFirst($id);

        $response = new Response();
        $response->setContentType("application/json; UTF-8");

        if ($user) $response->setJsonContent($user);
        else $response->setStatusCode(404);

        return $response;
    }

    public function activeAction()
    {
        $_user = $this->request->getJsonRawBody();

        $user = $this->
        modelsManager->
        createQuery("UPDATE Users SET Users.active='$_user->active' WHERE Users.id='$_user->id'");

        $response = new Response();

        if ($user->execute()) {
            $response->setStatusCode(200);
        } else $response->setStatusCode(409);

        return $response;
    }

    public function roleAction()
    {
        $_user = $this->request->getJsonRawBody();

        $user = $this->
        modelsManager->
        createQuery("UPDATE Users SET Users.role='$_user->role' WHERE Users.id='$_user->id'");

        $response = new Response();

        if ($user->execute()) {
            $response->setStatusCode(200);
        } else $response->setStatusCode(409);

        return $response;
    }

    public function updateAction()
    {
        $_user = $this->request->getJsonRawBody();

        $user = $this->
        modelsManager->
        createQuery("UPDATE Users SET 
Users.password = '$_user->password',
Users.username = '$_user->username', 
Users.role='$_user->role' WHERE Users.id='$_user->id'");

        $response = new Response();

        if ($user->execute()) {
            $response->setStatusCode(200);
        } else $response->setStatusCode(409);

        return $response;
    }
}