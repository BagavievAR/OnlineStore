using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Core.DTOs;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAll()
    {
        var products = await _unitOfWork.Products.GetAllWithDetailsAsync();

        var result = products.Select(p => new ProductReadDto
        {
            Id = p.Id,
            Title = p.Title,
            Slug = p.Slug,
            Price = p.Price,
            Stock = p.Stock,
            Description = p.Description,
            IsPublished = p.IsPublished,
            CreatedAt = p.CreatedAt,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? "",
            BrandId = p.BrandId,
            BrandName = p.Brand?.Name ?? "",
            ImageUrl = p.ImageUrl
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductReadDto>> GetById(int id)
    {
        var product = await _unitOfWork.Products.GetByIdWithDetailsAsync(id);

        if (product == null)
            return NotFound();

        return Ok(new ProductReadDto
        {
            Id = product.Id,
            Title = product.Title,
            Slug = product.Slug,
            Price = product.Price,
            Stock = product.Stock,
            Description = product.Description,
            IsPublished = product.IsPublished,
            CreatedAt = product.CreatedAt,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? "",
            BrandId = product.BrandId,
            BrandName = product.Brand?.Name ?? "",
            ImageUrl = product.ImageUrl
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductReadDto>> Create(ProductCreateDto dto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId);
        var brand = await _unitOfWork.Brands.GetByIdAsync(dto.BrandId);

        if (category == null)
            return BadRequest("Category not found");

        if (brand == null)
            return BadRequest("Brand not found");

        var product = new Product
        {
            Title = dto.Title,
            Slug = dto.Slug,
            Price = dto.Price,
            Stock = dto.Stock,
            Description = dto.Description,
            IsPublished = dto.IsPublished,
            CategoryId = dto.CategoryId,
            BrandId = dto.BrandId,
            ImageUrl = dto.ImageUrl
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        var created = await _unitOfWork.Products.GetByIdWithDetailsAsync(product.Id);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, new ProductReadDto
        {
            Id = created!.Id,
            Title = created.Title,
            Slug = created.Slug,
            Price = created.Price,
            Stock = created.Stock,
            Description = created.Description,
            IsPublished = created.IsPublished,
            CreatedAt = created.CreatedAt,
            CategoryId = created.CategoryId,
            CategoryName = created.Category?.Name ?? "",
            BrandId = created.BrandId,
            BrandName = created.Brand?.Name ?? "",
            ImageUrl = created.ImageUrl
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ProductUpdateDto dto)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId);
        var brand = await _unitOfWork.Brands.GetByIdAsync(dto.BrandId);

        if (category == null)
            return BadRequest("Category not found");

        if (brand == null)
            return BadRequest("Brand not found");

        product.Title = dto.Title;
        product.Slug = dto.Slug;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.Description = dto.Description;
        product.IsPublished = dto.IsPublished;
        product.CategoryId = dto.CategoryId;
        product.BrandId = dto.BrandId;
        product.ImageUrl = dto.ImageUrl;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        _unitOfWork.Products.Remove(product);

        try
        {
            await _unitOfWork.SaveChangesAsync();
            return NoContent();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException)
        {
            return BadRequest("Нельзя удалить товар, потому что он используется в заказах.");
        }
    }
}