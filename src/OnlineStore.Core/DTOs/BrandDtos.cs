namespace OnlineStore.Core.DTOs;

public class BrandReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; }
}

public class BrandCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; } = true;
}

public class BrandUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; } = true;
}