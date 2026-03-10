using AlphaVault.Interfaces;
using AlphaVault.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AlphaVault.Controllers
{
    [Route("api/settings")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet]
        public async Task<ActionResult<Settings>> GetSettings()
        {
            var settings = await _settingsService.GetSettingsAsync();
            return Ok(settings);
        }

        [HttpPut]
        [AllowAnonymous]
        public async Task<IActionResult> PutSettings([FromBody] Settings settings)
        {
            await _settingsService.UpdateSettingsAsync(settings);
            return Ok(settings);
        }
    }
}