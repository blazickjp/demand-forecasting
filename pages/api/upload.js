import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({ dest: '/tmp' });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const { file } = req;

  // Process the uploaded file and generate the forecast
  // Replace this with your demand forecasting logic
  const forecast = await processFile(file);

  res.status(200).json({ forecast });
});

export default apiRoute;

async function processFile(file) {
  // Implement your demand forecasting logic here
  // Use the file.path to access the uploaded .csv file
  return { message: 'Forecast generated successfully!' };
}
