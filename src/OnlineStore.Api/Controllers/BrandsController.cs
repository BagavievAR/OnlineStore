using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Core.DTOs;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public BrandsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrandReadDto>>> GetAll()
    {
        var brands = await _unitOfWork.Brands.GetAllAsync();

        var result = brands.Select(b => new BrandReadDto
        {
            Id = b.Id,
            Name = b.Name,
            Slug = b.Slug,
            IsVisible = b.IsVisible
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BrandReadDto>> GetById(int id)
    {
        var brand = await _unitOfWork.Brands.GetByIdAsync(id);

        if (brand == null)
            return NotFound();

        return Ok(new BrandReadDto
        {
            Id = brand.Id,
            Name = brand.Name,
            Slug = brand.Slug,
            IsVisible = brand.IsVisible
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<BrandReadDto>> Create(BrandCreateDto dto)
    {
        var brand = new Brand
        {
            Name = dto.Name,
            Slug = dto.Slug,
            IsVisible = dto.IsVisible
        };

        await _unitOfWork.Brands.AddAsync(brand);
        await _unitOfWork.SaveChangesAsync();

        var result = new BrandReadDto
        {
            Id = brand.Id,
            Name = brand.Name,
            Slug = brand.Slug,
            IsVisible = brand.IsVisible
        };

        return CreatedAtAction(nameof(GetById), new { id = brand.Id }, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BrandUpdateDto dto)
    {
        var brand = await _unitOfWork.Brands.GetByIdAsync(id);

        if (brand == null)
            return NotFound();

        brand.Name = dto.Name;
        brand.Slug = dto.Slug;
        brand.IsVisible = dto.IsVisible;

        _unitOfWork.Brands.Update(brand);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var brand = await _unitOfWork.Brands.GetByIdAsync(id);

        if (brand == null)
            return NotFound();

        _unitOfWork.Brands.Remove(brand);

        try
        {
            await _unitOfWork.SaveChangesAsync();
            return NoContent();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException)
        {
            return BadRequest("Нельзя удалить бренд, потому что с ним связаны товары.");
        }
    }
}