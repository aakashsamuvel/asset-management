using AlphaVault.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AlphaVault.DTOs;
using Microsoft.EntityFrameworkCore;
using AlphaVault.Data;
using AlphaVault.Models;

namespace AlphaVault.Controllers
{
    [Route("api/procurement")]
    [ApiController]
    public class ProcurementController : ControllerBase
    {
        private readonly IProcurementService _procurementService;
        private readonly ApplicationDbContext _context;

        public ProcurementController(IProcurementService procurementService, ApplicationDbContext context)
        {
            _procurementService = procurementService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProcurements()
        {
            var procurements = await _procurementService.GetProcurementsAsync();
            return Ok(procurements);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProcurement(int id)
        {
            var procurement = await _procurementService.GetProcurementByIdAsync(id);
            if (procurement == null)
            {
                return NotFound();
            }
            return Ok(procurement);
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            try
            {
                var procurement = await _context.Procurements.FindAsync(id);
                if (procurement == null)
                {
                    return NotFound();
                }

                procurement.Stage = "Approval";
                procurement.Status = "Approved";
                procurement.ApprovedBy = "System";
                procurement.ApprovalDate = DateTime.Now;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error approving procurement: {ex.Message}");
            }
        }

        [HttpPost("{id}/quotation")]
        public async Task<IActionResult> AddQuotation(int id, [FromBody] Procurement procurement)
        {
            var existingProcurement = await _context.Procurements.FindAsync(id);
            if (existingProcurement == null)
            {
                return NotFound();
            }

            existingProcurement.Stage = "Quotation";
            existingProcurement.QuotationId = procurement.QuotationId;
            existingProcurement.QuotationAmount = procurement.QuotationAmount;
            existingProcurement.QuotationVendor = procurement.QuotationVendor;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/purchase")]
        public async Task<IActionResult> CreatePurchaseOrder(int id, [FromBody] Procurement procurement)
        {
            var existingProcurement = await _context.Procurements.FindAsync(id);
            if (existingProcurement == null)
            {
                return NotFound();
            }

            existingProcurement.Stage = "Purchase";
            existingProcurement.PurchaseOrderNumber = procurement.PurchaseOrderNumber;
            existingProcurement.PurchaseDate = procurement.PurchaseDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/receive")]
        public async Task<IActionResult> ReceiveItems(int id, [FromBody] Procurement procurement)
        {
            var existingProcurement = await _context.Procurements.FindAsync(id);
            if (existingProcurement == null)
            {
                return NotFound();
            }

            existingProcurement.Stage = "Receive";
            existingProcurement.ReceiveDate = procurement.ReceiveDate;
            existingProcurement.ReceivedBy = procurement.ReceivedBy;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreateProcurement([FromBody] Procurement procurement)
        {
            procurement.Stage = "Request";
            _context.Procurements.Add(procurement);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProcurement), new { id = procurement.Id }, procurement);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProcurement(int id, [FromBody] Procurement procurement)
        {
            if (id != procurement.Id)
            {
                return BadRequest();
            }

            var existingProcurement = await _context.Procurements.FindAsync(id);
            if (existingProcurement == null)
            {
                return NotFound();
            }

            existingProcurement.Title = procurement.Title ?? existingProcurement.Title;
            existingProcurement.Type = procurement.Type ?? existingProcurement.Type;
            existingProcurement.Requester = procurement.Requester ?? existingProcurement.Requester;
            existingProcurement.Amount = procurement.Amount;
            existingProcurement.Priority = procurement.Priority ?? existingProcurement.Priority;
            existingProcurement.Description = procurement.Description ?? existingProcurement.Description;
            existingProcurement.QuotationId = procurement.QuotationId;
            existingProcurement.QuotationAmount = procurement.QuotationAmount;
            existingProcurement.QuotationVendor = procurement.QuotationVendor;
            existingProcurement.PurchaseOrderNumber = procurement.PurchaseOrderNumber;
            existingProcurement.PurchaseDate = procurement.PurchaseDate;
            existingProcurement.ReceiveDate = procurement.ReceiveDate;
            existingProcurement.ReceivedBy = procurement.ReceivedBy;
            existingProcurement.Stage = procurement.Stage;

            _context.Entry(existingProcurement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Procurements.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
    }
}