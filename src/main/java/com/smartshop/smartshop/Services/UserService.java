package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public List<Usuario> getAllUsers(){
        return userRepository.findAll();
    }
    public Optional<Usuario> getUsuario(String id){
        return userRepository.findById(id);
    }
    public Usuario setUsuario(Usuario usuario){
        userRepository.save(usuario);
        return usuario;
    }
    public void deleteUsuario(Usuario usuario){
        userRepository.delete(usuario);
    }
    public void updateUsuario(Usuario usuario){
        userRepository.save(usuario);
    }

}
