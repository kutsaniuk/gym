<?php

use Phalcon\Mvc\Controller;
use Phalcon\Mvc\Model\Query;
use Phalcon\Http\Response as response;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class NewsController extends Controller
{
    public function indexAction()
    {
        $currentPage = (int)$_GET["page"];
        $limit = (int)$_GET["limit"];

        $posts = Posts::find();
        $paginator = new PaginatorModel(
            array(
                "data" => $posts,
                "limit" => $limit,
                "page" => $currentPage
            )
        );

        $page = $paginator->getPaginate();


        $response = new Response();
        $response->setContentType("application/json");

        if ($posts) $response->setJsonContent($page);
        else $response->setStatusCode(404);

        return $response;
    }

    public function postAction($id)
    {
        $post = Posts::findFirst($id);

        $response = new Response();
        $response->setContentType("application/json");

        if ($post) $response->setJsonContent($post);
        else $response->setStatusCode(404);

        return $response;
    }

    public function removeAction()
    {
        $_post = $this->request->getJsonRawBody();

        $post = Posts::findFirst($_post->id);

        $response = new Response();
        $response->setContentType("application/json");

        if ($post->delete()) $response->setStatusCode(200);
        else $response->setStatusCode(404);

        return $response;
    }

}