package com.amess.messbook.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "\"User\"")
public class User implements UserDetails, Principal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    private String nickname;

    private String email;

    private String bio;

    private LocalDate dateOfBirth;

    private String password;

    private Boolean activated;

    private String phoneNumber;

    //  TODO: Use a default image if a user doesn't set one
    private String avatarFilePath;

    private String bannerFilePath;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(
//            fetch = FetchType.EAGER,
            mappedBy = "sender",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private final List<UserRelationship> otherUsers = new ArrayList<>();

//    The entity owning this list is the sender (initializer) of the relationship
    public void addRelationship(User otherUser, String status) {
        var userRelationship = UserRelationship.builder()
                .id(new RelationshipId(this.getId(), otherUser.getId()))
                .sender(this)
                .receiver(otherUser)
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        otherUsers.add(userRelationship);
    }

    public void removeOtherUser(User otherUser) {
        for (Iterator<UserRelationship> iterator = otherUsers.iterator();
             iterator.hasNext(); ) {
            UserRelationship userRelationship = iterator.next();

            if (userRelationship.getSender().equals(this)
                    && userRelationship.getReceiver().equals(otherUser)
            ) {
                iterator.remove();
                userRelationship.setSender(null);
                userRelationship.setReceiver(null);
            }
        }
    }

    @Override
    public String getName() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
