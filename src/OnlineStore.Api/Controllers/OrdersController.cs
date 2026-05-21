using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.Core.DTOs;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public OrdersController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue(ClaimTypes.Name)
                     ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var orders = await _unitOfWork.Orders.GetByUserIdAsync(userId);

        var result = orders.Select(MapOrder);

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll()
    {
        var orders = await _unitOfWork.Orders.GetAllWithDetailsAsync();
        return Ok(orders.Select(MapOrder));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderReadDto>> GetById(int id)
    {
        var order = await _unitOfWork.Orders.GetByIdWithDetailsAsync(id);

        if (order == null)
            return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirst("sub")?.Value;

        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && order.UserId != userId)
            return Forbid();

        return Ok(MapOrder(order));
    }

    [HttpPost]
    public async Task<ActionResult<OrderReadDto>> Create(OrderCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        if (dto.Items == null || dto.Items.Count == 0)
            return BadRequest("Order must contain at least one item");

        var order = new Order
        {
            UserId = userId,
            DeliveryAddress = dto.DeliveryAddress,
            ContactPhone = dto.ContactPhone,
            Status = "Pending"
        };

        decimal total = 0;

        foreach (var itemDto in dto.Items)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(itemDto.ProductId);

            if (product == null)
                return BadRequest($"Product with id={itemDto.ProductId} not found");

            if (itemDto.Qty <= 0)
                return BadRequest("Quantity must be greater than zero");

            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                Qty = itemDto.Qty,
                UnitPrice = product.Price
            };

            total += product.Price * itemDto.Qty;
            order.Items.Add(orderItem);
        }

        order.Total = total;

        await _unitOfWork.Orders.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        var created = await _unitOfWork.Orders.GetByIdWithDetailsAsync(order.Id);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapOrder(created!));
    }

    private static OrderReadDto MapOrder(Order order)
    {
        return new OrderReadDto
        {
            Id = order.Id,
            UserId = order.UserId,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            Total = order.Total,
            DeliveryAddress = order.DeliveryAddress,
            ContactPhone = order.ContactPhone,
            Items = order.Items.Select(i => new OrderItemReadDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductTitle = i.Product?.Title ?? string.Empty,
                Qty = i.Qty,
                UnitPrice = i.UnitPrice
            }).ToList()
        };
    }
}