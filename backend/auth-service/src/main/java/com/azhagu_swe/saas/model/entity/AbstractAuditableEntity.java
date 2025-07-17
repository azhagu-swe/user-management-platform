package com.azhagu_swe.saas.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * An abstract base class for entities that require auditing of creation
 * and update timestamps, and potentially who created/updated them.
 *
 * This class uses {@link MappedSuperclass}, so its fields are mapped
 * to the tables of its subclasses. It is not an entity itself.
 */
@MappedSuperclass
@Getter
@Setter
public abstract class AbstractAuditableEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100, updatable = false)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;


}