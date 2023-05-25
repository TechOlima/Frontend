using Microsoft.AspNetCore.Mvc;

namespace Frontend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IWebHostEnvironment _appEnvironment;        

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IWebHostEnvironment appEnvironment)
        {
            _logger = logger;
            _appEnvironment = appEnvironment;
        }

        [HttpGet]
        public ActionResult<string> Get()
        {
            return "Метод работает";
        }

        [HttpPost]
        public ActionResult<string> Post([FromForm] int productid, [FromForm] IFormFile uploadedfile)
        {
            Random rnd = new Random();
            int value = rnd.Next(0, 100);

            string content_path = "";

            if (uploadedfile != null)
            {
                content_path = productid.ToString() + "_" + value.ToString() + "_" + uploadedfile.FileName;
                string path = @"\ClientApp\public\images\" + content_path;
                using (var fileStream = new FileStream(_appEnvironment.ContentRootPath + path, FileMode.Create))
                {
                    uploadedfile.CopyTo(fileStream);
                }

            }

            return content_path;
        }
    }
}
