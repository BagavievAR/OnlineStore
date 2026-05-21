namespace OnlineStore.Core.DTOs;

public class OrderItemCreateDto
{
    public int ProductId { get; set; }
    public int Qty { get; set; }
}

public class OrderCreateDto
{
    public string DeliveryAddress { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public List<OrderItemCreateDto> Items { get; set; } = new();
}

public class OrderItemReadDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductTitle { get; set; } = string.Empty;
    public int Qty { get; set; }
    public decimal UnitPrice { get; set; }
}

public class OrderReadDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public List<OrderItemReadDto> Items { get; set; } = new();
}