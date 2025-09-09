"""create locations table

Revision ID: 74884d632b75
Revises: 2b85d11826f9
Create Date: 2025-09-07 12:50:34.649535

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '74884d632b75'
down_revision = '2b85d11826f9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create locations table
    op.create_table('locations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=1), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_locations_category'), 'locations', ['category'], unique=False)
    op.create_index(op.f('ix_locations_id'), 'locations', ['id'], unique=False)
    op.create_index(op.f('ix_locations_latitude'), 'locations', ['latitude'], unique=False)
    op.create_index(op.f('ix_locations_longitude'), 'locations', ['longitude'], unique=False)
    op.create_index(op.f('ix_locations_title'), 'locations', ['title'], unique=False)
    op.create_index('ix_locations_category_title', 'locations', ['category', 'title'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_locations_category_title', table_name='locations')
    op.drop_index(op.f('ix_locations_title'), table_name='locations')
    op.drop_index(op.f('ix_locations_longitude'), table_name='locations')
    op.drop_index(op.f('ix_locations_latitude'), table_name='locations')
    op.drop_index(op.f('ix_locations_id'), table_name='locations')
    op.drop_index(op.f('ix_locations_category'), table_name='locations')
    op.drop_table('locations')
