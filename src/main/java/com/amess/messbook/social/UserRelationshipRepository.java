package com.amess.messbook.social;

import com.amess.messbook.social.entity.RelationshipId;
import com.amess.messbook.social.entity.UserRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRelationshipRepository extends JpaRepository<UserRelationship, RelationshipId> {
}
