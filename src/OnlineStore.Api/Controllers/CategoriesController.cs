using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Core.DTOs;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoriesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryReadDto>>> GetAll()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();

        var result = categories.Select(c => new CategoryReadDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            IsVisible = c.IsVisible
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryReadDto>> GetById(int id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        return Ok(new CategoryReadDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            IsVisible = category.IsVisible
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CategoryReadDto>> Create(CategoryCreateDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Slug = dto.Slug,
            IsVisible = dto.IsVisible
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        var result = new CategoryReadDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            IsVisible = category.IsVisible
        };

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CategoryUpdateDto dto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        category.Name = dto.Name;
        category.Slug = dto.Slug;
        category.IsVisible = dto.IsVisible;

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        _unitOfWork.Categories.Remove(category);

        try
        {
            await _unitOfWork.SaveChangesAsync();
            return NoContent();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException)
        {
            return BadRequest("Нельзя удалить категорию, потому что в ней есть товары.");
        }
    }
}