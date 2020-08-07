using System.ComponentModel.DataAnnotations;

namespace dating_app_backend.Dtos
{
    public class UserForLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}