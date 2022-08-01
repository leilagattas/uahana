using Microsoft.AspNetCore.Mvc;
using uahana.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace uahana.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RubroController : ControllerBase
    {
        public readonly UahanaContext _context;

        public RubroController(UahanaContext context)
        {
            _context = context;
        }

        [HttpGet]
        // [Authorize]
        public IEnumerable<Rubro> GetAll()
        {
            return _context.Rubros.ToList();
        }

        [HttpGet("{id}")]
        // [Authorize]
        public async Task<ActionResult<Rubro>> GetById(long id)
        {
            var item = await _context.Rubros.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // [HttpPost]
        // public async Task<ActionResult<Contacto>> Create([FromBody] Contacto item)
        // {
        //     if (item == null)
        //     {
        //         return BadRequest();
        //     }

        //     var currentUser = HttpContext.User; 
        //     int years = 0;

        //     if (currentUser.HasClaim(c => c.Type == "FechaCreado"))
        //     {
        //         DateTime date = DateTime.Parse(currentUser.Claims.FirstOrDefault(c => c.Type == "FechaCreado").Value);
        //         years = DateTime.Today.Year - date.Year;
        //     }

        //     if (years < 2)
        //     {
        //         return Forbid();
        //     }

        //     _context.Contacto.Add(item);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction(nameof(GetById), new {Id=item.Id}, item);
        // }


        // [HttpPut("{id}")]
        // public async Task<ActionResult> Update(long id, [FromBody] Contacto item)
        // {
        //     if (item == null || id == 0)
        //     {
        //         return BadRequest();
        //     }

        //     _context.Entry(item).State  = EntityState.Modified;
        //     await _context.SaveChangesAsync();

        //     return NoContent();
        // }

        // //REVISAR PARA NO BORRAR DEL TODO.. Q SE BORRE NOMAS ISDELETED = TRUE
        // [HttpDelete("{id}")]
        // public async Task<ActionResult> Delete(long id)
        // {
        //     if (id == 0)
        //     {
        //         return NotFound();
        //     }

        //     var contact = await _context.Contacto.FindAsync(id);
        //     if (contact == null){
        //         return NotFound();
        //     }
        //     _context.Contacto.Remove(contact);
        //     await _context.SaveChangesAsync();

        //     return NoContent();
        // }
    }
}