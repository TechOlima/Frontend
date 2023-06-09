﻿using Microsoft.AspNetCore.Mvc;

namespace Frontend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private static HttpClient httpClient = new()
        {
            BaseAddress = new Uri("https://localhost:7184/api/"),
        };        

        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<string>> Get()
        {
            using HttpResponseMessage response = await httpClient.GetAsync("Products");

            string request = response.RequestMessage.ToString();
            
            /*
             response.EnsureSuccessStatusCode().WriteRequestToConsole();
    
            var jsonResponse = await response.Content.ReadAsStringAsync();
            WriteLine($"{jsonResponse}\n");
             */

            var jsonResponse = await response.Content.ReadAsStringAsync();

            return jsonResponse;            
        }

        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WeatherForecast>>> Get()
        {
            using HttpResponseMessage response = await httpClient.GetAsync("Products");
            
            var jsonResponse = await response.Content.ReadAsStringAsync();


            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
        */
        /*
        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            using HttpResponseMessage response = await httpClient.GetAsync("todos/3");

            response.EnsureSuccessStatusCode().WriteRequestToConsole();

            var jsonResponse = await response.Content.ReadAsStringAsync();

            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
        */
    }
}