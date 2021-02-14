import nextConnect from "next-connect";
import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (request, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, request, response) {
    response
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message as string}` });
  },
  onNoMatch(request, response) {
    response
      .status(405)
      .json({ error: `Method '${request.method!}' Not Allowed` });
  },
});

apiRoute.use(upload.single());

apiRoute.post((request, response) => {
  response.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
