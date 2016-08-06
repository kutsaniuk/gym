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

        $posts = Posts::find(array(
            "order" => "created DESC"
        ));
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

    public function updateAction()
    {
        $_post = $this->request->getJsonRawBody();

        $post = Posts::findFirst($_post->id);
        $post->update(
            array(
                'title' => $_post->title,
                'subheading' => $_post->subheading,
                'article' => $_post->article,
                'created' => $_post->created,
                'users_id' => $_post->users_id
            )
        );

        $response = new Response();

        if ($post->update()) {
            $response->setStatusCode(200);
        } else $response->setStatusCode(409);

        return $response;
    }

    public function createAction()
    {
        $_post = $this->request->getJsonRawBody();

        $post = new Posts();
        $post->assign( 
            array(
                'title' => $_post->title,
                'subheading' => $_post->subheading,
                'article' => $_post->article,
                'created' => $_post->created,
                'image' => $_post->image,
                'filetype' => $_post->filetype,
                'users_id' => $_post->users_id
            )
        );

        $response = new Response();

        if ($post->save()) $response->setStatusCode(200);
        else $response->setStatusCode(409);

        return $response;
    }

    public function imageAction($id)
    {
        $post = Posts::findFirst($id);

        header('Content-Type: ' . $post->filetype);
        $response = new Response();
        if ($post->image != null)
            echo base64_decode($post->image);
        else return $response->setStatusCode(404);
    }

}
