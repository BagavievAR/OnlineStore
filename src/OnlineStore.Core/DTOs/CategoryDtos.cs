namespace OnlineStore.Core.DTOs;

public class CategoryReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; }
}

public class CategoryCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; } = true;
}

public class CategoryUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsVisible { get; set; } = true;
}