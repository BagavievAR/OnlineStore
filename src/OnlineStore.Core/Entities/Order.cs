namespace OnlineStore.Core.Entities;

public class Order
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public decimal Total { get; set; }

    public string DeliveryAddress { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}