using System.ComponentModel.DataAnnotations;

namespace dating_app_backend.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(16, MinimumLength = 4, ErrorMessage = "Password must be between 4 and 16 characters")]
        public string Password { get; set; }
    }
}