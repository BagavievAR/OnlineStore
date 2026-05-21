namespace OnlineStore.Core.Entities;

public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; } = true;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}